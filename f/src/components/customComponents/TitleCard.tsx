
const TitleCard = ({ title, IconComponent }: { title: string; IconComponent?: React.ElementType }) => {
  return (
    <div className="relative flex items-center justify-center w-full mt-14 px-4">
      <div className="absolute w-full border-t-2 border-gray-600"></div>
      <div className="relative bg-white flex flex-col items-center px-4">
        <h2 className="text-xl sm:text-4xl md:text-4xl leading-none font-bold text-center flex items-center gap-3 text-black">
          {IconComponent && <IconComponent className="w-8 h-8 text-[#DBC166]" />} {title}
        </h2>
      </div>
    </div>
  );
};

export default TitleCard;
