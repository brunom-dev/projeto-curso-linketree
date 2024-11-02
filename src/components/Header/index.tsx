import {BiLogOutCircle} from "react-icons/bi"
import { Link } from "react-router-dom"

import {auth} from "../../services/firebaseConnection"
import {signOut} from "firebase/auth"
import { toast } from "react-toastify";

export function Header() {

    async function handleLogout() {
        await signOut(auth);
        toast.info('Sessão encerrada!');
    }

    return(
        <header className="w-full max-w-2xl mt-4 px-1">
            <nav className="w-full bg-white h-12 flex items-center justify-between rounded-md px-3">
                <div className="flex gap-4 font-medium">
                    <span className="hover:text-blue-600 transition-transform hover:scale-105">
                        <Link to={"/"}>Home</Link>
                    </span>  
                    <span className="hover:text-blue-600 transition-transform hover:scale-105">
                        <Link to={"/admin"}>Links</Link>
                    </span>
                    <span className="hover:text-blue-600 transition-transform hover:scale-105">
                        <Link to={"/admin/social"}>Redes Sociais</Link>
                    </span>
                </div>

                <button onClick={handleLogout} className="transition-transform hover:scale-110">
                    <BiLogOutCircle size={30} color="#db2629"/>
                </button>
            </nav>
        </header>
    )
}