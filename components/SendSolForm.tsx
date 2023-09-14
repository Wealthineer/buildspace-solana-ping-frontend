import { FC } from 'react'
import styles from '../styles/Home.module.css'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js'


export const SendSolForm: FC = () => {

    const { connection } = useConnection()
	const { publicKey, sendTransaction } = useWallet()

    const sendSol = event => {
        event.preventDefault()

        if (!connection || !publicKey) { 
			alert("Please connect your wallet first")
			return
		}

        const to =new Web3.PublicKey(event.target.recipient.value)

        const transaction = new Web3.Transaction().add(
            Web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: to,
                lamports: event.target.amount.value * Web3.LAMPORTS_PER_SOL,
            })
        )


        sendTransaction(transaction, connection).then(sig => {
			console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
		})


        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
    }

    async function transferSOL(connection: Web3.Connection, from: Web3.Keypair, to: Web3.PublicKey, amount: number) {
        const transaction = new Web3.Transaction().add(
            Web3.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: amount * Web3.LAMPORTS_PER_SOL,
            })
        )


  
    const transactionSignature = await Web3.sendAndConfirmTransaction(connection, transaction, [from])
  
    console.log(
      `Transaction https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
      )
  }

    return (
        <div>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
        </div>
    )
}