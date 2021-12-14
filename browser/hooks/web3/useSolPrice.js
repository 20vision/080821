import * as Coingecko from 'coingecko-api'
import { useState, useEffect } from 'react'

const CoinGeckoClient = new Coingecko()

export default function useSolPrice(){
    const [solPrice, setSolPrice] = useState()
 
    useEffect(() => {
        var interval;
        const getSolPrice = (refresh = false) => {
            if (!refresh){
                setSolPrice({
                    status: 'loading'
                })
            }
            CoinGeckoClient.coins.fetch("solana")
            .then((info) => {
                setSolPrice({
                    price: info.data.market_data.current_price.usd,
                    status: 'success'
                })
            })
            .catch(() => {
                setSolPrice({
                    status: 'error'
                })
            })
        }
        getSolPrice()
        interval = setInterval(() => {
            getSolPrice(true)
        }, 10000)
        return () => {
            if (interval){
                clearInterval(interval)
            }
        }
    }, [setSolPrice])

    return solPrice
}