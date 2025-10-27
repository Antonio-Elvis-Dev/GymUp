import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

// Unit Test - testes unitarios 

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase // system under test

describe('Search Gyms Use Case', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    // Teste para validar que o usuario pode fazer check-in
    it('should be able to search for gyms', async () => {

        await gymsRepository.create({
            title: 'Java Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -9.406466,
            longitude: -36.629427,
        })
        await gymsRepository.create({
            title: 'Python Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -9.406466,
            longitude: -36.629427,
        })

        const { gyms } = await sut.execute({
            query: 'Python Gym',
            page: 1
        })
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Python Gym' })

        ])

    })

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Python Gym ${i}`,
                description: 'Some description',
                phone: '11999999999',
                latitude: -9.406466,
                longitude: -36.629427,
            })
        }
        const { gyms } = await sut.execute({
            query: 'Python Gym',
            page: 2
        })


        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({title:'Python Gym 21'}),
            expect.objectContaining({title:'Python Gym 22'})
        ])
    })
})