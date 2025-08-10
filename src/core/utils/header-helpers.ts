export const getAuthJwt = (context: any) => {
  const authHeader = context.switchToHttp().getRequest().headers[
    'authorization'
  ];
};
