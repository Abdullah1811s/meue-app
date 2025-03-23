import { FaInstagram, FaTiktok, FaTwitter, FaFacebook } from "react-icons/fa";

const Footer = () => {
  const documents = [
    {
      name: "General Terms and Conditions",
      path: "/doc/generalTerm",
    },
    {
      name: "Partner Program Terms and Conditions",
      path: "/doc/PartnerProgram",
    },
    {
      name: "Competition Rules",
      path: "/doc/ComRule",
    },
    {
      name: "Frequently Asked Questions",
      path: "/doc/FAQ",
    },
    {
      name: "Privacy Policy",
      path: "/doc/Privacy",
    },
    {
      name: "Terms of Service",
      path: "/doc/TOS",
    },
  ];

  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-bold text-amber-500">THE MENU</h2>
          <p className="mt-2 text-sm">YOUR WORLD, YOUR WAY</p>
          <p className="mt-4 text-sm">
            Email:{" "}
            <a
              href="mailto:support@themenuportal.co.za"
              className="underline"
            >
              support@themenuportal.co.za
            </a>
          </p>
        </div>

        {/* Center Section */}
        <div className="flex flex-col space-y-2 text-sm">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("social")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="hover:underline"
          >
            About Us
          </a>
        </div>

        {/* Right Section - Documents */}
        <div className="flex flex-col space-y-2 text-sm">
          <h3 className="font-semibold">Legal Documents</h3>
          {documents.map((doc, index) => (
            <a
              key={index}
              href={`${window.location.origin}${doc.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline unselectable"
              onCopy={(e) => {
                e.preventDefault(); // Prevent copying
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
        <a
          href="https://www.instagram.com/the.menu.portal?igsh=eXdxOXJ1NGtqZ21y&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-500 text-xl"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.tiktok.com/@themenu.sa?_t=ZM-8uviPKlCEZ4&_r=1"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-500 text-xl"
        >
          <FaTiktok />
        </a>
        <a
          href="https://x.com/themenu_sa?s=21"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-500 text-xl"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.facebook.com/share/1AGK8NsgzY/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-amber-500 text-xl"
        >
          <FaFacebook />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
