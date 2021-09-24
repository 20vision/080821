import styles from '../../styles/modal/trade.module.css'
import { Area, XAxis, YAxis, ResponsiveContainer, Bar, BarChart, CartesianGrid, Tooltip, AreaChart } from 'recharts'
import { useState } from 'react'

export default function Trade() {
    const [selectedRoute, setSelectedRoute] = useState(0)



    return (
        <div className={styles.container}>
            <div className={`noselect ${styles.header}`}>
                <h1 onClick={() => setSelectedRoute(0)} className={selectedRoute == 0?styles.highlight:null}>
                    Swap
                </h1>
                <h1 onClick={() => setSelectedRoute(1)} className={selectedRoute == 1?styles.highlight:null}>
                    Liquidity
                </h1>
                <div onClick={() => setSelectedRoute(2)} className={`${styles.charts} ${selectedRoute == 2?styles.highlight:null}`}>
                    {/* Implement different coclors with chartPositive and negative */}
                    <h1 className={selectedRoute == 2?styles.highlightH1:null}>Charts</h1><span className={styles.chartNegative}>↓9%</span>
                </div>
            </div>

            <AreaChart width={400} height={250}>

            </AreaChart>

            <a 
            onClick={e => {
                e.preventDefault()
                
            }} 
            className={styles.tradeButton}>
                <div>
                    <h2>Swap</h2>
                </div>
            </a>

        </div>
    )
}
