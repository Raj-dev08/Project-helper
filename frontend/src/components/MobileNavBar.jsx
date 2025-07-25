import { Plus , Search , Users  , User , LogOut ,LogIn , Settings , Home , ArrowBigLeft } from 'lucide-react'
import { Link , useLocation , useNavigate} from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useProjectStore } from '../store/useProjectStore'
import { useState ,useEffect} from 'react'
import { Popover } from '@headlessui/react'

const MobileNavBar = () => {
    const { authUser, logout ,checkAuth} = useAuthStore();
    const {changeSearchFilter}=useProjectStore();
    const [text,setText]=useState("");
    const location=useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    const handleFormChange=(e)=>{
        e.preventDefault()
        changeSearchFilter(text)
    }

  return (
    <>
    <header className='fixed top-0 w-full bg-base-100 h-[50px] flex gap-10 justify-between z-40'>
        <div
        className='flex justify-center items-center'
        onClick={()=>navigate(-1)} >
             <ArrowBigLeft/>
        </div>
       
        
        <form onSubmit={handleFormChange} className={`flex w-[1000px] ${location.pathname==="/explore"?"block":"hidden"}`}>
            <input
                type="text"
                className='input input-bordered focus:outline-none rounded-md w-full'
                placeholder='search'
                value={text}
                onChange={(e)=>{setText(e.target.value)}}
            />
            <button type="submit" className='mx-2'> 
            <Search/>
            </button>
        </form>

        <Popover className="relative flex justify-end">
            <Popover.Button className="p-2 rounded-md hover:bg-base-300">
                <Settings size={22} />
            </Popover.Button>

            <Popover.Panel className="absolute right-0 mt-2 w-40 bg-base-100 shadow-lg rounded-md border border-gray-200 z-50">
                <div className="flex flex-col p-2 text-sm">
                    <Link
                        to="/settings"
                        className="px-3 py-2 rounded-md flex items-center gap-2"
                    >
                        <Settings size={18} /> Settings
                    </Link>

                    {authUser ? (
                        <button
                            onClick={logout}
                            className="px-3 py-2 rounded-md flex items-center gap-2 text-left"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="px-3 py-2 rounded-md flex items-center gap-2"
                        >
                            <LogIn size={18} /> Login
                        </Link>
                    )}
                </div>
            </Popover.Panel>
        </Popover>

    </header>

    <footer className='fixed bottom-0 w-full bg-base-100 h-[50px] flex gap-10 justify-between'>

        {authUser && (
            <>            
                <div className={`p-2 rounded-md font-mono font-semibold ${location.pathname=="/"?"bg-base-300 text-base-content":""} rounded-badge`}>
                    <Link to="/" className="flex">
                        <Home /> 
                        
                    </Link>
                </div>


                <div className={`p-2 rounded-md font-mono font-semibold ${location.pathname=="/explore"?"bg-base-300 text-base-content":""} rounded-badge`}>
                    <Link to="/explore" className="flex">
                        <Search /> 
                        
                    </Link>
                </div>

                <div className={`p-2 rounded-md font-mono font-semibold ${location.pathname=="/create-project"?"bg-base-300 text-base-content":""} rounded-badge`}>
                    <Link to="/create-project" className="flex">
                        <Plus  /> 
                        
                    </Link>
                </div>

                <div className={`p-2 rounded-md font-mono font-semibold ${location.pathname=="/my-friends"?"bg-base-300 text-base-content":""} rounded-badge`}>
                <Link to="/my-friends" className="flex">
                    <Users /> 
                    
                </Link>
                </div>

                <div className={`p-2 rounded-md font-mono font-semibold ${location.pathname=="/profile"?"bg-base-300 text-base-content":""} rounded-badge`}>
                    <Link to="/profile" className="flex">
                        <User /> 
                        
                    </Link>
                </div>
            </>

        )}

        
    </footer>

    </>
  )
}

export default MobileNavBar