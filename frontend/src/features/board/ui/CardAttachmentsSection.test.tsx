import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CardAttachmentsSection } from './CardAttachmentsSection';
import * as api from '../api/cardAttachmentsApi';

vi.mock('../api/cardAttachmentsApi', () => ({
  fetchCardAttachments: vi.fn(),
  uploadCardAttachment: vi.fn(),
  addCardAttachmentLink: vi.fn(),
  deleteCardAttachment: vi.fn(),
  setCardCover: vi.fn(),
  formatAttachmentSize: (n: number | null) => (n == null ? '' : `${n} B`),
}));

const sampleRow: api.CardAttachmentRow = {
  id: 1,
  cardId: 42,
  kind: 'FILE',
  fileName: 'photo.png',
  mimeType: 'image/png',
  sizeBytes: 1200,
  url: 'http://api.test/uploads/photo.png',
  previewUrl: 'http://api.test/uploads/photo-preview.webp',
  isImage: true,
  isVideoLink: false,
  isCover: false,
  uploader: { id: 2, name: 'Bob' },
  createdAt: '2026-06-06T12:00:00.000Z',
};

describe('CardAttachmentsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.fetchCardAttachments).mockResolvedValue([]);
  });

  it('loads and shows empty state', async () => {
    render(
      <CardAttachmentsSection accessToken="tok" workspaceId={1} cardId={42} />,
    );
    expect(screen.getByText('Вложения')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Нет вложений.')).toBeInTheDocument();
    });
  });

  it('renders image thumbnail and link row', async () => {
    vi.mocked(api.fetchCardAttachments).mockResolvedValue([
      sampleRow,
      {
        ...sampleRow,
        id: 2,
        kind: 'LINK',
        fileName: 'youtube.com',
        isImage: false,
        isVideoLink: true,
        url: 'https://www.youtube.com/watch?v=1',
        previewUrl: null,
        sizeBytes: null,
      },
    ]);

    render(
      <CardAttachmentsSection accessToken="tok" workspaceId={1} cardId={42} />,
    );

    await waitFor(() => {
      expect(document.querySelector('.trello-card-attachments-file-thumb img')).toBeTruthy();
      expect(screen.getByText('youtube.com')).toBeInTheDocument();
      expect(screen.getByText(/Ссылка на видео/)).toBeInTheDocument();
      expect(screen.queryByText(/Обложка/)).not.toBeInTheDocument();
    });
  });

  it('submits link attachment', async () => {
    vi.mocked(api.addCardAttachmentLink).mockResolvedValue(sampleRow);

    render(
      <CardAttachmentsSection accessToken="tok" workspaceId={1} cardId={42} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Прикрепить ссылку' }));
    const input = screen.getByPlaceholderText(/https/i);
    fireEvent.change(input, {
      target: { value: 'https://example.com/doc.pdf' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    await waitFor(() => {
      expect(api.addCardAttachmentLink).toHaveBeenCalledWith(
        'tok',
        1,
        42,
        'https://example.com/doc.pdf',
      );
    });
  });

  it('deletes attachment after confirmation', async () => {
    vi.mocked(api.fetchCardAttachments).mockResolvedValue([sampleRow]);
    vi.mocked(api.deleteCardAttachment).mockResolvedValue(undefined);

    render(
      <CardAttachmentsSection accessToken="tok" workspaceId={1} cardId={42} />,
    );

    await waitFor(() => {
      expect(screen.getByText('photo.png')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Удалить вложение' }));

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Удалить вложение?')).toBeInTheDocument();
    expect(screen.getByText(/photo\.png/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(api.deleteCardAttachment).toHaveBeenCalledWith('tok', 1, 42, 1);
    });
  });

  it('shows error when video file is selected', async () => {
    render(
      <CardAttachmentsSection accessToken="tok" workspaceId={1} cardId={42} />,
    );
    await waitFor(() => expect(screen.getByText('Нет вложений.')).toBeInTheDocument());

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['x'], 'clip.mp4', { type: 'video/mp4' });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Видео прикрепляйте ссылкой/)).toBeInTheDocument();
    });
    expect(api.uploadCardAttachment).not.toHaveBeenCalled();
  });
});
