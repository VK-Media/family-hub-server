import { Response } from 'express'
import { Types } from 'mongoose'

import {
	CreateFamilyInput,
	DeleteFamilyInput,
	GetAllFamiliesInput,
	GetFamilyByIdInput,
	UpdateFamilyInput
} from '../interfaces/Family.interfaces'
import { FamilyModel } from '../models/index'
import { userExist } from '../util/Models.util'

class FamilyController {
	public createFamily = (req: CreateFamilyInput, res: Response) => {
		req.body.members.forEach(memberId => {
			if (!userExist(memberId))
				return res.status(400).send('Members does not exist')
		})

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

		if (!family) res.status(404).send()

		res.send(family)
	}

	public updateFamily = async (req: UpdateFamilyInput, res: Response) => {
		const family = await FamilyModel.findById(req.params.familyId)

		if (!family) return res.status(404).send()

		try {
			if (req.body.newFamilyName) family.name = req.body.newFamilyName
			if (req.body.newFamilyMemberId) {
				if (!userExist(req.body.newFamilyMemberId)) {
					return res.status(400).send('Member does not exist')
				}
				family.members.push(Types.ObjectId(req.body.newFamilyMemberId))
			}
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
		const family = await FamilyModel.findByIdAndRemove(req.params.familyId)

		if (!family) res.status(404).send()

		res.send(family)
	}
}

export default FamilyController
