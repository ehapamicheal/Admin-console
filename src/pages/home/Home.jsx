import { Orders, SalesCards, Revenue } from '../../sections/home';

const Home = () => {  

  return (
    <div className="mx-2 md:mx-4 mt-10 pt-14 pb-6">
      <SalesCards />
      <Revenue />
      <Orders />
    </div>
  )
}

export default Home;