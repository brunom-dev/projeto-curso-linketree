import { Header } from "../../components/Header"
import { Input } from '../../components/Input/index';
import { FormEvent, useState, useEffect } from "react";
import { db } from "../../services/firebaseConnection";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";


export interface RedesProps {
    facebook: string;
    instagram: string;
    youtube: string;
}

export const Networks = () => {

    const [facebook, setFacebook] = useState<string>("");
    const [instagram, setInstagram] = useState<string>("");
    const [youtube, setYoutube] = useState<string>("");

    async function handleRegister(e: FormEvent) {
        e.preventDefault();

        const redes: RedesProps = {
            facebook,
            instagram,
            youtube
        }

        await setDoc(doc(db, "minhas-redes", "principal"), redes)
            .then(() => {
                toast.success("Links atualizados com sucesso!");
            })
            .catch((err) => {
                toast.error("Aconteceu um error");
                console.log(err)
            })

    }

    useEffect(() => {
        async function searchRedes() {
            await getDoc(doc(db, "minhas-redes", "principal"))
                .then((response) => {
                    if(response.data() !== undefined) {
                        const currentRedes: RedesProps = {
                            instagram: response.data()?.instagram ,
                            youtube:  response.data()?.youtube,
                            facebook:  response.data()?.facebook
                        }
                    
                        return (
                            setFacebook(currentRedes.facebook),
                            setInstagram(currentRedes.instagram),
                            setYoutube(currentRedes.youtube)
                        )
                    }

                })
        }

        searchRedes();
    }, [])

    return(
        <div className="min-h-screen flex flex-col pb-7 px-2 items-center">
            <Header />

            <h1 className="text-white text-2xl font-medium mt-8 mb-4">
                Minhas redes sociais
            </h1>


            <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Link do Facebook</label>
                <Input 
                    placeholder="Digite a URL do facebook" 
                    type="URL"
                    value={facebook}
                    onChange={ (event) => setFacebook(event.target.value)} 
                />

                <label className="text-white font-medium mt-2 mb-2">Link do Instagram</label>
                <Input 
                    placeholder="Digite a URL do instagram" 
                    type="URL"
                    value={instagram}
                    onChange={ (event) => setInstagram(event.target.value)} 
                />


                <label className="text-white font-medium mt-2 mb-2">Link do Youtube</label>
                <Input 
                    placeholder="Digite a URL do youtube" 
                    type="URL"
                    value={youtube}
                    onChange={ (event) => setYoutube(event.target.value)} 
                />

                <button type="submit" className="text-white bg-blue-600 h-9 rounded-md items-center justify-center flex font-medium mt-4">Salvar Links</button>

            </form>

        </div>
    )
}