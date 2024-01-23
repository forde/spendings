'use client'
import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'

interface Item {
    date: string
    place: string
    pln: string
    account: string
}

interface Props {
    data: Item[]
}

interface Source {
    name: string
    spent: number
}

export default function Counter({ data }: Props) {

    const [spendingSources, setSpendingSources] = useState<Source[]>([])
    const [cursor, setCursor] = useState(0)
    const [sum, setSum] = useState(0)

    const cursorRef = useRef<number>(0);
    const sumRef = useRef<number>(0);

    useEffect(() => {
        const sources = data.reduce((acc: {[key:string]: number}, item) => {
            
            const place = [
                'APPLE.COM/BILL',
                'APTEKA',
                'BILETOMAT',
                'BOLT',
                'CUKIERNIA',
                'EMPIK',
                'GOOGLE',
                'JMP S.A. BIEDRONKA',
                'MCDONALDS',
                'NETTO',
                'PIEKARNIA',
                'ROSSMANN',
                'ZABKA'
            ].reduce((acc, item) => {
                return acc.toUpperCase().startsWith(item) ? item : acc
            }, item.place)

            const $ = Math.abs(parseFloat(item.pln.replace(',', '.')))
            return {
                ...acc,
                [place.toUpperCase()]: Math.round((acc[place] || 0) + (isNaN($) ? 0 : $))
            }
        }, {})

        const formatedSources = Object.keys(sources).map(k => ({ name: k, spent: sources[k] }))

        setSpendingSources(formatedSources)
        console.log({ data, formatedSources })
    }, [])



    useEffect(() => {
        if(!spendingSources.length) return 

        const onKeyup = (e: any) => {
            
            const place = spendingSources[cursorRef.current]?.name
            const spent = spendingSources[cursorRef.current]?.spent

            if(!place) {
                return alert('Thats all!');
            }

            if (e.key === 'Escape') {
                cursorRef.current += 1
                setCursor(cursorRef.current)
                return
            }

            if (e.key === 'Enter') {
                cursorRef.current += 1
                setCursor(cursorRef.current)
                sumRef.current += spent
                setSum(sumRef.current)
            }
        };

        window.addEventListener('keyup', onKeyup);
        return () => {
            window.removeEventListener('keyup', onKeyup);
        };
    }, [spendingSources.length]);

    const place = spendingSources[cursor]?.name
    const spent = spendingSources[cursor]?.spent

    return (
        <Wrapper>
            <hr/>
            <h1>{place}</h1>
            <h1>{spent} PLN</h1>
            <p><strong>ENTER</strong> - dolicz<br/><strong>ESCAPE</strong> - pomiń</p>
            <hr/>
            <h1>Suma: <span style={{color: 'red'}}>{sum}</span> PLN, {cursor} z {spendingSources.length} pozycji</h1>
        </Wrapper>
    )
}

const Wrapper = styled.div`
`