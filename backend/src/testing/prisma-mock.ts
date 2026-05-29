export function createPrismaMock(): any {
  const mockFn = () => jest.fn();
  return {
    user: {
      findUnique: mockFn(),
      create: mockFn(),
      update: mockFn(),
    },
    authToken: {
      findUnique: mockFn(),
      create: mockFn(),
      update: mockFn(),
    },
    character: {
      findUnique: mockFn(),
      findMany: mockFn(),
      create: mockFn(),
      update: mockFn(),
      updateMany: mockFn(),
    },
    xpEvent: {
      create: mockFn(),
      findFirst: mockFn(),
    },
    healthEvent: {
      create: mockFn(),
    },
    card: {
      findMany: mockFn(),
      findUnique: mockFn(),
      create: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    list: {
      findMany: mockFn(),
      findUnique: mockFn(),
      create: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    board: {
      findMany: mockFn(),
      findUnique: mockFn(),
      create: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    workspace: {
      findUnique: mockFn(),
      findMany: mockFn(),
      create: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    workspaceMember: {
      findUnique: mockFn(),
      findFirst: mockFn(),
      findMany: mockFn(),
      create: mockFn(),
      delete: mockFn(),
    },
    workspaceInvite: {
      findUnique: mockFn(),
      findMany: mockFn(),
      create: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    workspaceActivity: {
      findMany: mockFn(),
      create: mockFn(),
    },
    comment: {
      findMany: mockFn(),
      findUnique: mockFn(),
      create: mockFn(),
      update: mockFn(),
      delete: mockFn(),
    },
    userSettings: {
      upsert: mockFn(),
      update: mockFn(),
    },
    userSession: {
      findUnique: mockFn(),
      findMany: mockFn(),
      create: mockFn(),
      update: mockFn(),
      updateMany: mockFn(),
    },
    userSecurityEvent: {
      findMany: mockFn(),
      create: mockFn(),
    },
    friendRequest: {
      findUnique: mockFn(),
      findFirst: mockFn(),
      findMany: mockFn(),
      create: mockFn(),
      upsert: mockFn(),
      update: mockFn(),
      delete: mockFn(),
      count: mockFn(),
    },
    directMessage: {
      findMany: mockFn(),
      findFirst: mockFn(),
      create: mockFn(),
      updateMany: mockFn(),
      groupBy: mockFn(),
      count: mockFn(),
    },
    $transaction: mockFn(),
    $queryRaw: mockFn(),
  };
}
