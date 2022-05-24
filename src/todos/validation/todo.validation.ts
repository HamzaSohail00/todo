import { NextFunction } from 'express';
import { Request, Response } from 'express';

export function requiredFieldsValidation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (
		!req.body.category ||
		!req.body.startTime ||
		!req.body.endTime ||
		!req.body.description
	) {
		return res.status(400).send({
			error: 'category, description, startTime & endTime is required',
		});
	}
	next();
}

export function dateValidationOnCreateTodo(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (
		!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(req.body.startTime) ||
		!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(req.body.endTime)
	)
		return res.status(400).send({
			error: 'Provide a valid date format',
		});
	if (new Date(req.body.startTime) > new Date(req.body.endTime)) {
		return res.status(400).send({
			error: 'StartTime must be less than endTime and must have a valid format',
		});
	}
	next();
}
