import fetch from 'node-fetch';

export default async function(currencyOne, currencyTwo, money) {
    const link = `https://api.api-ninjas.com/v1/convertcurrency?have=${currencyOne}&want=${currencyTwo}&amount=${money}`;
    const res = await fetch(link, {
        headers: {
            'X-Api-Key': 'w/DFGJ+sVb1SJ5tXWPlwNQ==D3zKc1k0KkSNzLvV'
        }
    });
    const data = await res.json();
    return data;
}