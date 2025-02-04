 

export type ErrorResponse = { success: false; error: string; data: null };
export type SuccessResponse = { success: true; data: unknown };  
export type LoginResponse = ErrorResponse | SuccessResponse;

