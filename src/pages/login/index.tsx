import { Link } from 'react-router-dom';
import { Input } from '../../components/Input/index';
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConnection";
import { signInWithEmailAndPassword }  from "firebase/auth"
import { toast } from 'react-toastify';

export const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        await signInWithEmailAndPassword(auth, email, password)

            .then( (userCredential) =>  {
                const user = userCredential.user;
                console.log(user);
                toast.success("Usuario Logado!")       
                setEmail("");
                setPassword("");
                navigate('/admin', {replace: true});
            })
            .catch( (error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                console.log(error);

                switch (errorCode) {
                    case 'auth/invalid-email':
                        toast.error('Email invalido!');
                        break;
                    case 'auth/user-not-found':
                        toast.error('Usuário não encontrado!');
                        break;
                    case 'auth/wrong-password': 
                        toast.error('Senha incorreta');
                        break;
                    default:
                        toast.error('Email/senha incorretos.');
                        break;
                }
            })



    }

    return(
        <div className="flex flex-col w-full h-screen items-center justify-center">
            <Link to={'/'}>
                <h1 className="text-white mb-7 font-bold text-5xl">Dev
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-400 bg-clip-text text-transparent">Link</span>
                </h1>
            </Link>

            <form className="w-full max-w-xl flex flex-col px-2" onSubmit={handleSubmit}>
                <Input 
                    placeholder="Digite seu email" 
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <Input 
                    placeholder="Digite sua senha" 
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    
                />
                

                <button 
                    className="h-9 bg-blue-600 rounded border-0 text-lg font-medium text-white disabled:bg-slate-700"
                    type="submit"
                    disabled={(!email) || (!password)}    
                > 
                    Acessar
                </button>
            </form>

        </div>
    )
}