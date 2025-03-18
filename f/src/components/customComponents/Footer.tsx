const Footer = () => {
  const documents = [
    {
      name: "General Terms and Conditions",
      path: "/docs/The_Menu_General_Terms_and_Conditions.pdf",
    },
    {
      name: "Partner Program Terms and Conditions",
      path: "/docs/The_Menu_Vendor_Program_Terms.pdf",
    },
    {
      name: "Competition Rules",
      path: "/docs/The_Menu_Competition_Rules.pdf",
    },
    {
      name: "Frequently Asked Questions",
      path: "/docs/The_Menu_FAQ.pdf",
    },
    {
      name: "Privacy Policy",
      path: "/docs/The_Menu_Privacy_Policy.pdf",
    },
    {
      name: "Terms of Service",
      path: "/docs/The_Menu_Terms_of_Service.pdf",
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
            Email: <a href="mailto:xyz@gmail.com" className="underline">support@themenuportal.co.za</a>
          </p>
        </div>

        {/* Center Section */}
        <div className="flex flex-col space-y-2 text-sm">
          <a href="#" className="hover:underline">Home</a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("social")?.scrollIntoView({ behavior: "smooth" });
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
    </footer>
  );
};

export default Footer;
