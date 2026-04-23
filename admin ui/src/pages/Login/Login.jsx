// // src/pages/Login/Login.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loginError, setLoginError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();
  
//   // Use the auth context
//   const { login } = useAuth();

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoginError("");
//   setIsSubmitting(true);

//   try {
//     const result = await login(email, password);

//     if (result.success) {
//       navigate("/dashboard");
//     } else {
//       setLoginError(result.error);
//     }
//   } catch (error) {
//     setLoginError("Login failed. Please try again.");
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
//       <div className="max-w-md w-full space-y-8">
//         {/* Logo & Title */}
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
//               <span className="text-3xl text-white font-bold">H</span>
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
//             HerbiSense
//           </h1>
//           <p className="mt-2 text-lg text-emerald-700 font-medium">
//             ADMIN CONSOLE
//           </p>
//           <p className="mt-3 text-gray-600">
//             Secure access to herbal knowledge management
//           </p>
//         </div>

//         {/* Login Card */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
//           <div className="mb-8 text-center">
//             <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
//             <p className="text-gray-600 mt-1">Sign in to your admin account</p>
//           </div>

//           {/* Error Message */}
//           {loginError && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
//               <p className="text-red-700 text-sm font-medium text-center">
//                 ⚠️ {loginError}
//               </p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-4">
//               {/* Email Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                     placeholder="admin@herbisense.org"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     Password
//                   </label>
//                   <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
//                     Forgot password?
//                   </a>
//                 </div>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                   <input
//                     type="password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
//                     placeholder="••••••••"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Remember Me & Terms */}
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
//                   disabled={isSubmitting}
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
//                 isSubmitting 
//                   ? 'opacity-70 cursor-not-allowed' 
//                   : 'hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transform hover:-translate-y-0.5'
//               }`}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center">
//                   <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing In...
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>

//             {/* Security Info */}
//             <div className="pt-6 border-t border-gray-200">
//               <div className="flex items-center justify-center space-x-2 text-sm">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
//                   <span className="text-green-600 font-medium">ENCRYPTED CONNECTION ACTIVE</span>
//                 </div>
//               </div>
//               <p className="text-center text-xs text-gray-500 mt-3">
//                 © HerbiSense Admin Console v2.4.0-INDIGENOUS-SHIELD
//               </p>
//             </div>
//           </form>
//         </div>

//         {/* Demo Credentials */}
//         <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
//           <p className="text-sm text-emerald-800">
//   <span className="font-semibold">Demo Credentials:</span> admin@herbisense.com / admin123
// </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



// src/pages/Login/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserCog, Leaf, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState('admin');
  const navigate = useNavigate();
  
  const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError("");
  setIsSubmitting(true);

  try {
    const result = await login(email, password, userType);
    
    if (result.success) {
      // ✅ Correct routing
      if (userType === 'admin') {
        navigate("/dashboard");
      } else {
        navigate("/herbs"); // ✅ FIXED (was /herbs-management)
      }
    } else {
      setLoginError(result.error);
    }
  } catch (error) {
    setLoginError("Login failed. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const getDemoCredentials = () => {
    if (userType === 'admin') {
      return { email: 'admin@herbisense.com', password: 'admin123' };
    } else {
      return { email: 'creator@herbisense.com', password: 'creator123' };
    }
  };

  const fillDemoCredentials = () => {
    const demo = getDemoCredentials();
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white font-bold">H</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            HerbiSense
          </h1>
          <p className="mt-2 text-lg text-emerald-700 font-medium">
            {userType === 'admin' ? 'ADMIN CONSOLE' : 'HERB CREATOR PORTAL'}
          </p>
          <p className="mt-3 text-gray-600">
            {userType === 'admin' 
              ? 'Secure access to herbal knowledge management' 
              : 'Add and manage herbal remedies'}
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setUserType('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              userType === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Shield className="h-5 w-5" />
            Admin
          </button>
          <button
            onClick={() => setUserType('creator')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
              userType === 'creator'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Leaf className="h-5 w-5" />
            Herb Creator
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-1">
              {userType === 'admin' 
                ? 'Sign in to your admin account' 
                : 'Sign in to add and manage herbs'}
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium text-center">
                ⚠️ {loginError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder={userType === 'admin' ? "admin@herbisense.com" : "creator@herbisense.com"}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                isSubmitting 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                userType === 'admin' ? 'Sign In as Admin' : 'Sign In as Herb Creator'
              )}
            </button>

            {/* Quick Fill Demo Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2 transition-colors"
              >
                🔑 Use demo {userType === 'admin' ? 'admin' : 'creator'} credentials
              </button>
            </div>

            {/* Security Info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-600 font-medium">ENCRYPTED CONNECTION ACTIVE</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-3">
                © HerbiSense Admin Console v2.4.0-INDIGENOUS-SHIELD
              </p>
            </div>
          </form>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">Demo Credentials:</span><br />
            {userType === 'admin' ? (
              <>Admin: admin@herbisense.com / admin123</>
            ) : (
              <>Herb Creator: creator@herbisense.com / creator123</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;