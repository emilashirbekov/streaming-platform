import { Args, Query, Resolver } from '@nestjs/graphql'

import { CategoryModel } from './model/category.model'

import { CategoryService } from './category.service'

@Resolver(() => CategoryModel)
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], { name: 'findAllCategories' })
	public async findAll() {
		return this.categoryService.findAll()
	}

	@Query(() => [CategoryModel], { name: 'findRandomCategories' })
	public async findRandom() {
		return this.categoryService.findRandom()
	}

	@Query(() => CategoryModel, { name: 'findCategory' })
	public async findCategory(@Args('slug') slug: string) {
		return this.categoryService.findCategory(slug)
	}
}
