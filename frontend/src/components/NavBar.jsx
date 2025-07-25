import { Link , useLocation} from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useProjectStore } from '../store/useProjectStore'
import { useState ,useEffect} from 'react'
import { Plus , Search , Users  , User , LogOut ,LogIn , Settings } from 'lucide-react'

const NavBar = () => {
    const { authUser, logout ,checkAuth} = useAuthStore();
    const {changeSearchFilter}=useProjectStore();
    const [text,setText]=useState("");
    const location=useLocation();

    // // console.log(location)


    useEffect(() => {
        checkAuth();
    }, [checkAuth]);


    const handleFormChange=(e)=>{
        e.preventDefault()
        changeSearchFilter(text)
    }

    // console.log(location.pathname)
    


  return (
    <header className="bg-base-100 fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center p-4 gap-10">
            <div className='hover:bg-base-300 p-2 rounded-md'>
                    <Link to="/" className="text-2xl font-bold">ProjectHelper</Link>
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
            

            <nav className='flex justify-between gap-8 rounded-md'>
                {authUser?(
                    <div className='flex gap-8'>

                        <div className={`hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold ${location.pathname=="/explore"?"bg-primary text-primary-content":""} rounded-badge`}>
                            <Link to="/explore" className="flex">
                                <Search /> 
                                <p className='mx-2'>Explore</p>
                            </Link>
                        </div>

                        <div className={`hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold ${location.pathname=="/my-friends"?"bg-primary text-primary-content":""} rounded-badge`}>
                        <Link to="/my-friends" className="flex">
                            <Users /> 
                            <p className='mx-2'>Friends</p>
                        </Link>
                        </div>

                        <div className={`hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold ${location.pathname=="/profile"?"bg-primary text-primary-content":""} rounded-badge`}>
                            <Link to="/profile" className="flex">
                                <User /> 
                                <p className='mx-2'>Profile</p>
                            </Link>
                        </div>

                        <div className={`hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold ${location.pathname=="/create-project"?"bg-primary text-primary-content":""} rounded-badge`}>
                            <Link to="/create-project" className="flex">
                                <Plus  /> 
                                <p className='mx-2'>Create</p>
                            </Link>
                        </div>

                        <div className="hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold hover:rounded-badge flex cursor-pointer"
                        onClick={()=>logout()}
                        >
                           
                                <LogOut  /> 
                                <p className='mx-2'>LogOut</p>
                        </div>
                    </div>
                ):(
                     <div className={`hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold ${location.pathname=="/login"?"bg-primary text-primary-content":""} rounded-badge`}>
                            <Link to="/Login" className="flex">
                                <LogIn  /> 
                                <p className='mx-2'>Login</p>
                            </Link>
                        </div>
                )}
                
                 <div className={`hover:bg-primary hover:text-primary-content p-2 rounded-md font-mono font-semibold ${location.pathname=="/settings"?"bg-primary text-primary-content":""} rounded-badge`}>
                    <Link to="/settings" className="flex">
                        <Settings  /> 
                        <p className='mx-2'>Settings</p>
                    </Link>
                </div>
                
            </nav> 
           

           
               
                
              
                {/* <Link to="/incoming-request">
                    <div className='flex '>
                        <Bell/>
                        <sup className='text-blue-500 font-semibold'>{friendRequestToUser.length}</sup>
                    </div>
                </Link> */}
        </div>
    </header>
  )
}

export default NavBar