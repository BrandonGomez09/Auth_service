import { Request, Response } from "express";
import { GetUserByEmailUseCase } from "../../../application/use-cases/get-user-by-email.use-case";

export class GetUserByEmailController {
  constructor(private readonly useCase: GetUserByEmailUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const result = await this.useCase.execute(email);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(error.http_status || 500).json({
        success: false,
        message: error.message || "Internal error"
      });
    }
  }
}
