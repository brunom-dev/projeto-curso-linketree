export interface LinkProps {
    UID: string;
    name: string;
    URL: string;
    background: string;
    color: string;
    created?: object;
}


import { Header } from '../../components/Header';
import { Input } from '../../components/Input'
import { useState, FormEvent, useEffect } from 'react';
import { FiTrash } from "react-icons/fi"
import { db } from "../../services/firebaseConnection"
import { 
    addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export const Admin = () => {

    const [nameInput, setNameInput] = useState<string>("");
    const [URLInput, setURLInput] = useState<string>("");
    const [textColorInput, setTextColorInput] = useState<string>("#ffffff");
    const [bgColorInput, setBgColorImput] = useState<string>("#0000ff");
    const [links, setLinks] = useState<LinkProps[]>([])        
    const referenciaDB = collection(db, "meus-links");

    useEffect(() => {
        const queryRef = query(referenciaDB, orderBy("created", "asc"));
        
        const unsub = onSnapshot(queryRef, (snapshot) => {

            let documentos: LinkProps[] = [];
            snapshot.forEach((doc) => {documentos.push({
                UID: doc.id,
                name: doc.data().name,
                URL: doc.data().URL,
                color: doc.data().color,
                background: doc.data().background
            })})

            setLinks(documentos);
        })

        return () => {
            unsub();
        }
    }, [])

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        if(!nameInput || !URLInput) {
            return toast.error("Preencha todos os campos corretamente!");
        }

        if(nameInput.length < 5 || URLInput.length < 5) {
            return toast.error("Os campos devem ter ao menos 5 caracteres!")
        }

        const newLink = {
            name: nameInput,
            URL: URLInput,
            color: textColorInput,
            background: bgColorInput,
            created: new Date()
        }

        await addDoc(referenciaDB, newLink)
            .then(() => {
                toast.success("Cadastrado com sucesso!")
                console.log("cadastrado!")
                setNameInput("");
                setURLInput("");
            })
            .catch((error) => {
                console.log(error)
            })

    } 

    async function handleDelete(uid:string) {
        
        await deleteDoc(doc(db, "meus-links", uid))
            .then(() => {
                toast.success("Link deletado com sucesso!");
                console.log("deletado!");
            })
            .catch((error) => {
                toast.error("Ocorreu um erro ao deletar")
                console.log(error)
            })
    }

    return(
        <div className="min-h-screen flex flex-col pb-7 px-2 items-center">
            <Header />
            <form className='w-full max-w-xl mt-8 mb-3 flex flex-col' onSubmit={handleRegister}>
                <label className='font-medium my-2 text-white'>Nome do Link</label>
                <Input 
                    className="mb-4" 
                    placeholder='Nome do seu link'
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                />

                <label className='font-medium my-2 text-white'>URL do Link</label>
                <Input 
                    className="mb-4" 
                    placeholder='URL do seu link'
                    type="url"
                    value={URLInput}
                    onChange={(event) => setURLInput(event.target.value)}
                />

                <section className='flex my-4 gap-5'>
                    <div className='flex gap-2'>    
                        <label className='font-medium my-2 text-white'>Fundo do link</label>
                        <input 
                            type="color"
                            value={bgColorInput}
                            onChange={(e) => setBgColorImput(e.target.value)}
                        />
                    </div>

                    <div className='flex gap-2'>    
                        <label className='font-medium my-2 text-white'>Cor do link</label>
                        <input 
                            type="color"
                            value={textColorInput}
                            onChange={(e) => setTextColorInput(e.target.value)}
                        />
                    </div>
                </section>

                {nameInput && 
                <div className='flex items-center justify-center flex-col mb-7 p-1 border-gray-100/25 border rounded-md'>
                    <label className='font-medium my-2 text-white'>Veja como esta ficando</label>
                    <article 
                        className='w-11/12 max-w-lg flex flex-col items-center justify-between bg-zinc-900 rounded px-1 py-3'
                        style={{marginBottom: 8, marginTop: 8, backgroundColor: bgColorInput}}
                    >
                        <p style={{color: textColorInput}} className='font-medium'>{nameInput}</p>
                    </article>
                </div>
                }
                

                <button 
                    className='bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center mb-7' 
                    type='submit'>
                    Cadastrar
                </button>
            </form>

 
            <h2 className='font-bold text-white mb-4 text-2xl'>
                {links.length > 0? "Meus links" : "Você ainda não possui links cadastrados"  }
            </h2>


            {links.map((link) => (
                <article 
                    key={link.UID}
                    className='flex items-center justify-between w-11/12 max-w-xl rounded-lg py-3 px-3 mb-3 select-none'
                    style={{backgroundColor: link.background, color: link.color}}
                >
                    <p className='font-medium'>{link.name}</p>
                    <div>
                        <button
                            className='border border-dashed p-1 rounded bg-gray-700' 
                            onClick={() => {
                                handleDelete(link.UID)
                            }}  
                        >
                            <FiTrash size={18} color="#fff"/>
                        </button>
                    </div>
                </article>
            ))}

        </div>
    )
}