import { Response } from 'express'
import { Types } from 'mongoose'

import {
	AddFamilyMemberInput,
	CreateFamilyInput,
	DeleteFamilyInput,
	GetAllFamiliesInput,
	GetFamilyByIdInput,
	UpdateFamilyInput
} from '../interfaces/Family.interfaces'
import FamilyModel from '../models/Family.model'

class FamilyController {
	public createFamily = (req: CreateFamilyInput, res: Response) => {
		const family = new FamilyModel(req.body)

		family
			.save()
			.then(() => {
				res.status(201).send(family)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public getAllFamilies = async (req: GetAllFamiliesInput, res: Response) => {
		const families = await FamilyModel.find()

		res.send(families)
	}
	public getFamilyById = async (req: GetFamilyByIdInput, res: Response) => {
		const family = await FamilyModel.findById(req.params.familyId)

		res.send(family)
	}

	public updateFamily = async (req: UpdateFamilyInput, res: Response) => {
		const family = await FamilyModel.findById(req.params.familyId)
		try {
			if (req.body.newFamilyName) family.name = req.body.newFamilyName
		} catch (error) {
			res.status(400).send(error.message)
		}

		family
			.save()
			.then(() => {
				res.send(family)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public addFamilyMember = async (
		req: AddFamilyMemberInput,
		res: Response
	) => {
		const family = await FamilyModel.findById(req.params.familyId)
		try {
			family.members.push(Types.ObjectId(req.body.newFamilyMemberId))
		} catch (error) {
			res.status(400).send(error.message)
		}

		family
			.save()
			.then(() => {
				res.send(family)
			})
			.catch((err: Error) => {
				res.status(400).send(err.message)
			})
	}

	public deleteFamily = async (req: DeleteFamilyInput, res: Response) => {
		const family = await FamilyModel.findOneAndDelete(req.params.familyId)
		res.send(family)
	}
}

export default FamilyController
