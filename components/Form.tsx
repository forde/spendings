'use client'
import Papa from 'papaparse';
import { useState } from 'react'
import styled from 'styled-components'

import Counter from './Counter'

type CsvRow = string[]; 

export default function Form() {

    const [data, setData] = useState<string>('')

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
      
            reader.onload = (e) => {
                const text = e.target?.result as string;
      
                Papa.parse(text, {
                    header: false,
                    encoding: 'UTF-8',
                    complete: (results) => {
                        const data = (results.data as CsvRow[])
                            .filter(row => !(row.length === 1 && row[0] === ''))
                            .filter(row => /^\d{4}-\d{2}-\d{2}$/.test(row[0]))
                            .map(row => ({
                                date: row[0],
                                place: row[2].trim().replace(/\s+/g, ' '),
                                pln: row[8],
                                account: row[14].substring(0,3)+'.',
                            }))
                        setData(JSON.stringify(data))
                    },
                    error: (error: any) => console.error('Error parsing CSV file', error)
                });
            };
      
            reader.readAsText(file, "UTF-8");
        }
    };

    return <Wrapper>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {data && <Counter data={JSON.parse(data)} />}
    </Wrapper>
}

const Wrapper = styled.div`
    padding: 24px;
`