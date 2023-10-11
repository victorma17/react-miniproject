import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import { useForm } from "react-hook-form"
const { ethereum } = window

export function Balance() {
    const { register, handleSubmit } = useForm()
    const [cuenta, setCuenta] = useState(null)
    const [balance, setBalance] = useState(null)
    const [ok, setOK] = useState(null)
    const [ko, setKo] = useState(null)

    useEffect(() => {
        ethereum && ethereum.request({ method: 'eth_requestAccounts' }).then(cuenta => {
            setCuenta(cuenta[0])
            ethereum.on('accountsChanged', (i) => {
                setCuenta(i[0])
            })
        })
    }, [])


    useEffect(() => {
        if (cuenta) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            provider.getBalance(cuenta).then(balance => {
                console.log(ethers.utils.formatEther(balance))
                setBalance(ethers.utils.formatEther(balance))
            })
        }
    }, [cuenta])

    async function submit(data) {
        const parametros = {
            from: cuenta,
            to: data.address,
            value: ethers.utils.parseEther(data.amount).toHexString()
        }
        console.log(parametros)
        try {
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [parametros]
            })
            setOK(txHash)        
        } catch (error) {
            setKo(error)
        }
    }


    if (!ethereum) {
        return (<h2> Necesitas instalar metamask </h2>)
    }

    return (
        <div>
            <p>  Cuenta:  {cuenta ? cuenta : 'Cargando...'} </p>
            <p>  Saldo:  {balance ? balance : 'Cargando...'} </p>

            <form className="form-inline" onSubmit={handleSubmit(submit)}>
                <div className="form-group mb-3">
                    <label htmlFor="address">Address</label>
                    <input className="form-control" id="address" {...register("address")}/>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="amount">Amount</label>
                    <input className="form-control" id="amount" {...register("amount")}/>
                </div>
                <button type="submit" className="btn btn-primary mb-3">Send</button>
            </form>
            {ok && <div> {ok} </div>}
            {ko && <div> {ko} </div>}

            
        </div>
    )
}