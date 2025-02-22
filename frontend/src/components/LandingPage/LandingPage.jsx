
import './styles.css'
import { NavLink } from 'react-router-dom';


function LandingPage() {
    return (
        <div className='LandingPage overflow-hidden antialiased bg-white font-sans text-gray-900'>
            <main className="w-full">
               {/* start hero */}
<div className="bg-gray-100">
    <section className="cover bg-blue-teal-gradient relative bg-blue-600 px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 overflow-hidden py-48 flex items-center min-h-screen">
        <div className="h-full absolute top-0 left-0 z-0">
            <img src="images/cover-bg.jpg" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="lg:w-3/4 xl:w-2/4 relative z-10 h-100 lg:mt-16">
            <div className="animate-fade-in">
                <h1 className="text-white text-left text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">Online Medical Care, Right at Your Fingertips</h1>
                <p className="text-blue-100 text-left text-xl md:text-2xl leading-snug mt-4">Experience a new level of convenience and control over your healthcare with our AI-Enhanced Medical Diagnostics System.</p>
                <div className="mt-8 flex justify-start">
                    <a href="#features" className="px-8 py-4 bg-rose-500 hover:bg-rose-700 text-white rounded-lg inline-block font-bold border-2 border-yellow-700">Learn More</a>
                </div>
            </div>
        </div>
    </section>
</div>


{/* end hero */}


{/* start features */}


<section id='features' className="relative text-justify px-4 py-16 sm:px-8 lg:px-16 xl:px-40 pt-4 2xl:px-64 lg:py-24">
    <h1 className="text-5xl text-center pt-0 lg:py-12 leading-tight font-bold mt-4">Features</h1>
    <div className="mt-12 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Smart AI Chatbot</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Our AI Chatbot is trained and fine-tuned to provide accurate answers on medical treatments and prescriptions, ensuring you get the information you need quickly and reliably.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Brain Hemorrhage Detection</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Utilize our advanced AI model to detect brain hemorrhages from image reports such as CT scans, providing early diagnosis and timely intervention.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Symptom-Based Disease Detection</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Our AI model can accurately detect diseases based on the symptoms data provided, helping you understand potential health issues and seek appropriate care.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Patient Management Dashboard</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Healthcare providers can manage patient information efficiently with our comprehensive Patient Management Dashboard, streamlining workflows and improving patient care.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Doctor and Patient Interfaces</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Both doctors and patients have their own dedicated interfaces, providing real-time AI diagnostics and personalized healthcare experiences.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Real-Time Health Monitoring</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Monitor your health in real-time with our integrated tools, ensuring you stay informed and proactive about your well-being.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Secure Data Management</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Your health data is securely managed and protected, ensuring privacy and compliance with healthcare regulations.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Telemedicine Support</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Access telemedicine services for remote consultations, making healthcare more accessible and convenient.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Medication Reminders</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Set reminders for your medications to ensure you never miss a dose, helping you manage your treatment plan effectively.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Appointment Scheduling</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Easily schedule and manage appointments with healthcare providers, reducing wait times and improving your overall healthcare experience.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <h3 className="text-2xl font-semibold text-gray-900">Health Analytics</h3>
                </div>
                <div className="flip-card-back">
                    <p className="text-white mt-4">Gain insights into your health trends and patterns with our advanced analytics tools, helping you make informed decisions about your health.</p>
                </div>
            </div>
        </div>
        <div className="flip-card">
    <div className="flip-card-inner">
        <div className="flip-card-front">
            <h3 className="text-2xl font-semibold text-gray-900">Instant Chat Support</h3>
        </div>
        <div className="flip-card-back">
            <p className="text-white mt-4">Communicate with healthcare providers and get instant support through our integrated chat feature.</p>
        </div>
    </div>
</div>
    </div>
</section>


{/*end features}


                {/* start cta */}
                <section className="relative bg-blue-teal-gradient px-6 sm:px-10 lg:px-20 xl:px-48 2xl:px-72 py-16 text-center md:text-left">
                    <div className="md:flex md:items-center md:justify-center">
                        <h2 className="text-2xl font-bold text-white">Need Help? Reach Out to Us Today!</h2>
                        <NavLink to='/patient/login'
                        className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-100 rounded-lg inline-block font-medium shadow-md transition-colors duration-300 md:ml-8"
                        >
                        Get Started
                        </NavLink>
                    </div>
                </section>




                {/* end cta */}
                {/* start footer */}
<footer id="contact" className="relative text-left bg-gray-900 text-white px-4 sm:px-8 lg:px-16 xl:px-40 2xl:px-64 py-12 lg:py-16">
    <div className="flex flex-col lg:flex-row justify-between">
        {/* About Us Section */}
        <div className="w-full lg:w-1/3 lg:mx-4 lg:pr-8 mb-8 lg:mb-0">
            <h3 className="font-bold text-xl">About Us</h3>
            <p className="text-gray-400 mt-4">Revolutionize your healthcare experience with our cutting-edge AI-Enhanced Medical Diagnostics System. Our platform provides accurate and timely medical diagnoses using advanced AI technology.</p>
        </div>
        {/* Services Section */}
        <div className="w-full lg:w-1/3 lg:mx-4 mb-8 lg:mb-0">
            <h5 className="uppercase tracking-wider font-semibold text-gray-500">Services</h5>
            <ul className="mt-4">
                <li className="mt-2"><a href="#" title className="opacity-75 hover:opacity-100">Brain Hemorrhage Detection</a></li>
                <li className="mt-2"><a href="#" title className="opacity-75 hover:opacity-100">AI-Powered Symptom Checker</a></li>
                <li className="mt-2"><a href="#" title className="opacity-75 hover:opacity-100">Personalized Treatment Recommendations</a></li>
                <li className="mt-2"><a href="#" title className="opacity-75 hover:opacity-100">Real-time Health Monitoring</a></li>
            </ul>
        </div>
        {/* Subscribe for Newsletter Section */}
        <div className="w-full lg:w-1/3 lg:mx-4 lg:pr-8">
            <h5 className="uppercase tracking-wider font-semibold text-gray-500">Subscribe for our Newsletter</h5>
            <form className="flex items-center mt-6">
                <div className="w-full">
                    <div className="relative">
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-4 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="email" placeholder="Enter Your Email Address" />
                        <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 text-sm font-bold rounded absolute top-1 bottom-1 right-0 my-2 mr-2">Subscribe</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div className="mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 text-center">© 2024 AI-Enhanced Medical Diagnostics System &nbsp; | &nbsp; All Rights Reserved</p>
    </div>
</footer>
                {/* end footer */}
            </main>
        </div>
    );
}


export default LandingPage;

