import { Social } from '../../components/Social/index';
import {FaFacebook, FaInstagram, FaYoutube} from 'react-icons/fa'
import {getDocs, doc, collection, query, getDoc} from "firebase/firestore"
import { db } from '../../services/firebaseConnection';
import { useEffect, useState } from 'react';

import { LinkProps } from '../admin';
import { RedesProps } from '../networks';


export const Home = () => {

    const [links, setLinks] = useState<LinkProps[]>([])
    const [redes, setRedes] = useState<RedesProps>({
        youtube: "",
        facebook: "",
        instagram: ""
    })

    const referenciaLinks = collection(db, "meus-links");
    const referenciaRedes = doc(db, "minhas-redes", "principal");

    useEffect(() => {
        async function searchLinks() {
            const queryRef = query(referenciaLinks);
            await getDocs(queryRef)
                .then((response) => {
                    const listaLinks: LinkProps[] = []
                    response.forEach((doc) => {
                        const link:LinkProps = {
                            UID: doc.id,
                            name: doc.data()?.name,
                            background: doc.data()?.background,
                            color: doc.data()?.color,
                            URL: doc.data()?.URL,
                            created: doc.data()?.created
                        }
                        listaLinks.push(link);
                    })

                    setLinks(listaLinks);
                }) 
        }

        async function searchRedes() {
            await getDoc(referenciaRedes)
                .then((response) => {
                    const resultRedes: RedesProps = {
                        youtube:  response.data()?.youtube,
                        facebook: response.data()?.facebook,
                        instagram: response.data()?.instagram
                    }
                    
                    setRedes(resultRedes);
                })
        }

        searchLinks();
        searchRedes();
    },[])

    return(
        <div className="flex flex-col w-full py-4 justify-center items-center">
            <h1 className="md:text-4xl text-3xl text-white font-bold  mt-20">Bruno Macedo</h1>

            <span className="text-gray-50 mb-5 mt-3">Veja meus links 👇🏽</span>

            <main className="flex flex-col w-11/12 max-w-xl text-center">

                {links.map((link) => (
                    <section className="mb-4 w-full py-2 rounded-lg select-none transition-transform hover:scale-105 cursor-pointer" style={{background: link.background}} key={link.UID}>
                        <a href={link.URL} target='_blank'>
                            <p className="md:text-lg font-medium" style={{color: link.color}}>{link.name}</p>
                        </a>
                    </section>
                ))}
                

                <footer className="flex justify-center gap-3 my-4">
                    <Social url={redes.facebook}>
                        <FaFacebook size={35} color='#fff' />
                    </Social>

                    <Social url={redes.instagram}>
                        <FaInstagram size={35} color='#fff' />
                    </Social>
                    
                    <Social url={redes.youtube}>
                        <FaYoutube size={35} color='#fff' />
                    </Social>
                </footer>
            </main>
        </div>
    )
}