import { TGenericErrorResponse } from "../interface/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;

  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  const errorSources = [
    {
      path: "",
      message: `${extractedMessage} already exists!`,
    },
  ];

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleDuplicateError;
