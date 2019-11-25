import { Response } from 'express'

import {
	CreateFamilyInput,
	DeleteFamilyInput,
	GetAllFamiliesInput,
	GetFamilyByIdInput,
	UpdateFamilyInput
} from '../interfaces/Family.interfaces'
import { FamilyModel } from '../models/index'
import { addFamilyToUser, usersExist } from '../util/Models.util'

class FamilyController {
	public createFamily = async (req: CreateFamilyInput, res: Response) => {
		const members = await usersExist(req.body.members)

		if (!members) {
			return res.status(400).send('Some or more members does not exist')
		}

		const family = new FamilyModel(req.body)

		family
			.save()
			.then(() => {
				members.forEach(member => addFamilyToUser(member, family._id))
				res.status(201).send({ family })
			})
			.catch((err: Error) => {
				res.status(400).send({ error: err.message })
			})
	}

	public getAllFamilies = async (req: GetAllFamiliesInput, res: Response) => {
		const families = await FamilyModel.find()

		res.send({ families })
	}
	public getFamilyById = async (req: GetFamilyByIdInput, res: Response) => {
		const family = await FamilyModel.findById(req.params.familyId)

		if (!family) res.status(404).send()

		res.send({ family })
	}

	public updateFamily = async (req: UpdateFamilyInput, res: Response) => {
		const family = await FamilyModel.findById(req.params.familyId)

		if (!family) return res.status(404).send()

		try {
			if (req.body.newFamilyName) family.name = req.body.newFamilyName
		} catch (error) {
			res.status(400).send({ error: error.message })
		}

		family
			.save()
			.then(() => {
				res.send({ family })
			})
			.catch((err: Error) => {
				res.status(400).send({ error: err.message })
			})
	}

	public deleteFamily = async (req: DeleteFamilyInput, res: Response) => {
		const family = await FamilyModel.findById(req.params.familyId)

		if (!family) res.status(404).send()

		await family.remove()

		res.send({ family: { id: family._id } })
	}
}

export default FamilyController
