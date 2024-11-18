export const filesFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  const allowedTypes = ['application/pdf', 'text/plain'];

  if (!file) return callback(new Error('file is empty'), false);
  if (!allowedTypes.includes(file[0].mimetype)) {
    return callback(new Error('This is not file type allowed'), false);
  }

  callback(null, true);
};
