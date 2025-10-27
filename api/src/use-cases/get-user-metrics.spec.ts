import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

// Unit Test - testes unitarios 

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase // system under test

describe('Get user Metrics Use Case', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository)


    })



    // Teste para validar que o usuario pode fazer check-in
    it('should be able to get check-ins count from metrics', async () => {

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })
        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: 'user-01'
        })

        const { checkInsCount } = await sut.execute({
            userId: 'user-01',
        })
       expect(checkInsCount).toEqual(2)

    })
    


})