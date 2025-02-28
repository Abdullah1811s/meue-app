const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-bold text-amber-500">THE MENU</h2>
          <p className="mt-2 text-sm">YOUR WORLD, YOUR WAY</p>
          <p className="mt-4 text-sm">
            Email: <a href="mailto:xyz@gmail.com" className="underline">xyz@gmail.com</a>
          </p>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-sm">Sign up for the newsletter</p>
            <div className="flex items-center border-b border-white py-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-transparent border-none text-white placeholder-gray-400 focus:outline-none w-full"
              />
              <button className="text-white text-lg">→</button>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col space-y-2 text-sm">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Meet the founder</a>
          <a href="#" className="hover:underline">About us</a>
          <a href="#" className="hover:underline">Contact us</a>
        </div>

        {/* Right Section */}
        <div className="flex flex-col space-y-2 text-sm">
         
          <a 
            href="https://www.instagram.com/the.menu.portal?igsh=eXdxOXJ1NGtqZ21y&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline flex items-center"
          >
            ↗ Instagram
          </a>
          <a 
            href="https://www.tiktok.com/@themenu.sa?_t=ZM-8u2dEW0XbIT&_r=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline flex items-center"
          >
            ↗ TikTok
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
