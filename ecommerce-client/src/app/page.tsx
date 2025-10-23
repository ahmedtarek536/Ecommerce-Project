import { getAllCollections } from "@/api/collectionAPI";
import Link from "next/link";

export default async function Home() {
  const collections = await getAllCollections();

  return (
    <div>
      {/* Hero Image */}
      <img
        src="https://static.nike.com/a/images/w_2880,h_1410,c_fill,f_auto/ca985541-53cf-4274-850d-ff312f493924/image.jpg"
        alt="Nike page"
        className="object-cover max-h-[600px] sm:max-h-[500px] w-full"
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 bg-white">
        <p className="font-medium text-gray-900">Mallory Swanson</p>
        <h1
          className="text-3xl sm:text-6xl font-extrabold tracking-tight mt-2"
          style={{ letterSpacing: -3 }}
        >
          EYES ON THE PRIZE
        </h1>
        <p className="text-base sm:text-lg text-gray-800 mt-2">
          Mallory Swanson always gets her goals.
        </p>
        <Link href="/products" className="underline">
          <button className="mt-6 px-5 py-[6px] text-base bg-black text-white rounded-full font-semibold hover:bg-gray-900">
            Shop
          </button>
        </Link>
      </section>

      {/* Collections Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 ">
        {collections?.slice(0, 4)?.map((collection) => (
          <div
            key={collection.id}
            className="relative min-h-[450px] bg-cover bg-center flex items-end p-6"
            style={{ backgroundImage: `url(${collection.image})` }}
          >
            <div className="p-6 text-white rounded-lg">
              <p className="text-sm font-medium">{collection.description}</p>
              <h4 className="text-2xl font-medium mt-2">{collection.name}</h4>
              <Link href={`/products?collection=${collection.id}`}>
                <button className="mt-4 px-4 py-2 bg-white text-black rounded-full font-semibold">
                  Shop
                </button>
              </Link>
            </div>
          </div>
        ))}
      </section>
      <section className="flex flex-col items-center justify-center text-center py-16 bg-white">
        <h1
          className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2"
          style={{ letterSpacing: -3 }}
        >
          NIKE 24.7 COLLECTION
        </h1>
        <p className="text-base sm:text-lg text-gray-800 mt-2">
          Mallory Swanson always gets her goals.
        </p>
        <Link href="/products" className="underline">
          <button className="mt-6 px-5 py-[6px] text-base bg-black text-white rounded-full font-semibold hover:bg-gray-900">
            Shop
          </button>{" "}
        </Link>
      </section>

      <img
        src="https://static.nike.com/a/images/w_2880,h_1410,c_fill,f_auto/3ec8a7f2-b3cd-4bf4-9b15-d028116d076d/image.jpg"
        //  src="https://static.nike.com/a/images/w_2880,h_1410,c_fill,f_auto/80609106-d933-43e5-8b80-d510d63610c2/image.jpg"
        alt="Nike page"
        className="object-cover max-h-[500px] sm:max-h-[450px] w-full "
      />

      <section className="p-4">
        <div className="text-2xl text-black font-bold mt-12 p-4 tracking-tight">
          Shop The Collections
        </div>
        <div className="w-full recommendation overflow-x-auto mt-2">
          <div className="flex gap-6 flex-nowrap font-semibold">
            {collections?.map((collection) => (
              <div
                key={collection.id}
                className="shrink-0 w-[250px] relative text-white cursor-pointer"
              >
                <Link href={`/products?collection=${collection.id}`}>
                  <img
                    src={collection.image}
                    alt=""
                    className="h-full w-full object-cover rounded-lg"
                  />
                  <p className=" absolute bottom-3 left-[50%]  translate-x-[-50%]">
                    {collection.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Links */}
    </div>
  );
}
