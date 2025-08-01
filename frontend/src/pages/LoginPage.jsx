import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, KeyboardIcon  } from "lucide-react";
import toast from "react-hot-toast";
import { useTypeWriter } from "../components/typeWriter";

import { motion } from "framer-motion";


const imageVariants = {
  initial: { opacity: 0, x: 300 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const text=useTypeWriter("Welcome Back",100)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    
    if (success===true) login(formData)
  };

  const validateForm = ()=>{
    if(formData.email.trim()==="")return toast.error("must have a email");
    if(formData.password.trim()==="")return toast.error("must have a password");

    return true
  }

  return (
      <div className="min-h-screen flex items-center justify-center login">
        <div className="w-full sm:max-w-5xl max-w-lg  py-4 sm:py-6 md:py-8 space-y-8 bg-gradient-to-b  from-transparent to-base-300 backdrop-blur-sm rounded-lg flex flex-col lg:flex-row">
          
          <motion.div
            className="hidden lg:flex w-full lg:w-1/2  items-center justify-center"
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/j.png" alt="Welcome" className="w-full h-full rounded-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Welcome back</h2>
              <p className="opacity-70">
                Please sign in to your account to continue
              </p>
            </div>
          </div>
        </motion.div>

          {/* Logo
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <Keyboard  className="w-6 h-6 text-primary" />
              </div>
                
              <p className="text-stone-300">Sign in to your account</p>
            </div>
          </div> */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full lg:w-1/2 border-hidden p-6 rounded-lg shadow-lg  mx-4 sm:mx-14">
            <div className="flex flex-col items-center gap-2 group ">
          <div
            className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
          group-hover:bg-primary/20 transition-colors"
          >
            <KeyboardIcon className="size-6 text-primary" />
          </div>
          
           <motion.h1 
            className="text-2xl font-bold mt-2 text-white text-center"
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            >
            {text}
        </motion.h1>
        
        </div>
            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
        

            <div className="form-control my-6">
              <label className="label">
                <span className="label-text font-medium text-center">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn bg-gradient-to-l from-primary to-secondary hover:bg-gradient-to-l hover:from-primary/40 hover:to-secondary/40 w-full my-6 border-hidden" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center">
              <p className="text-base-content/60">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link link-primary">
                  Create account
                </Link>
              </p>
            </div>

          </form>

          
        </div>
      </div>
  );
};
export default LoginPage;