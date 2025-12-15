import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

// Unit Test - testes unitarios 

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase // system under test

describe('Create Gym Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {



        const { gym } = await sut.execute({
            title: 'Java Gym',

            description: 'Some description',
            phone: '11999999999',
            latitude: -9.406466,
            longitude: -36.629427,
            address:"Rua Antonio Matias, 1200",
            rating: 5

        })

        expect(gym.id).toEqual(expect.any(String))

    })


})





