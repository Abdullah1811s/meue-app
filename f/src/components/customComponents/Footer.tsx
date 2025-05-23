import { useState, useEffect } from "react";
import { FaInstagram, FaTiktok, FaXTwitter, FaFacebook } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.auth.isUserAuthenticated);
  const isVendorAuthenticated = useSelector((state: any) => state.auth.isVendorAuthenticated);
  const [homeNavigation, setHomeNavigation] = useState<string>("/");

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      if (isAuthenticated) {
        setHomeNavigation(`/users/${id}`);
      } else if (isVendorAuthenticated) {
        setHomeNavigation(`/vendor/${id}`);
      } else {
        setHomeNavigation("/");
      }
    } else {
      setHomeNavigation("/");
    }
  }, [isAuthenticated, isVendorAuthenticated]);

  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-bold text-amber-500">THE MENU</h2>
          <p className="mt-2 text-sm">YOUR WORLD, YOUR WAY</p>
          <p className="mt-4 text-sm">
            Email:{" "}
            <a href="mailto:support@themenuportal.co.za" className="underline">
              support@themenuportal.co.za
            </a>
          </p>
        </div>

        {/* Center Section */}
        <div className="flex flex-col space-y-2 text-sm">
          <a
            href={homeNavigation}
            onClick={(e) => {
              e.preventDefault();
              navigate(homeNavigation);
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
              if (window.getSelection) {
                window.getSelection()?.removeAllRanges();
              }
            }}
            className="hover:underline unselectable"
            onCopy={(e) => {
              e.preventDefault();
              alert("Copying is disabled for this content.");
            }}
          >
            Home
          </a>
          <Link
            to='/aboutUs'
            className="hover:underline"
            
          >
            About Us
          </Link>
         
          <a
            href="/affiliated/register"
            onClick={(e) => {
              e.preventDefault();
              navigate("/affiliated/register");
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
            }}
            className="hover:underline"
          >
            Join as Affiliate
          </a>
          <a
            href="/vendorOnBoarding"
            onClick={(e) => {
              e.preventDefault();
              navigate("/vendorOnBoarding");
              window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
            }}
            className="hover:underline"
          >
            Join as Partner
          </a>
        </div>

        {/* Right Section - Documents */}
        <div className="flex flex-col space-y-2 text-sm">
          <h3 className="font-semibold">Legal Documents</h3>
          {[
            { name: "General Terms and Conditions", path: "/doc/generalTerm" },
            { name: "Partner Program Terms and Conditions", path: "/doc/PartnerProgram" },
            { name: "Competition Rules", path: "/doc/ComRule" },
            { name: "Frequently Asked Questions", path: "/doc/FAQ" },
            { name: "Privacy Policy", path: "/doc/Privacy" },
            { name: "Terms of Service", path: "/doc/TOS" },
          ].map((doc, index) => (
            <a
              key={index}
              href={doc.path}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline unselectable"
              onCopy={(e) => {
                e.preventDefault();
                alert("Copying is disabled for this content.");
              }}
            >
              {doc.name}
            </a>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 flex justify-center space-x-6">
        {[
          {
            icon: <FaInstagram />,
            url: "https://www.instagram.com/the.menu.portal?igsh=eXdxOXJ1NGtqZ21y&utm_source=qr",
            label: "Instagram"
          },
          {
            icon: <FaTiktok />,
            url: "https://www.tiktok.com/@themenu.sa?_t=ZM-8uviPKlCEZ4&_r=1",
            label: "TikTok"
          },
          {
            icon: <FaXTwitter />, // New X logo
            url: "https://x.com/themenu_sa?s=21",
            label: "X (formerly Twitter)"
          },
          {
            icon: <FaFacebook />,
            url: "https://www.facebook.com/share/1AGK8NsgzY/?mibextid=wwXIfr",
            label: "Facebook"
          }
        ].map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="hover:text-amber-500 text-xl"
          >
            {item.icon}
          </a>
        ))}
      </div>

    </footer>
  );
};

export default Footer;
