import Optimisation from '@/components/images/Optimisation';
import sharp from 'sharp';

const page = async () => {
  // await sharp('in.gif', { animated: true }).toFile('out.webp');

  // sharp('input.jpg')
  //   .resize(300, 200)
  //   .toFile('output.webp', function (err) {
  //     <div>
  //       <h2>Error: {err.name}</h2>
  //       <p>{err.message}</p>
  //     </div>;
  //   });
  return (
    <div>
      <Optimisation />
    </div>
  );
};

export default page;
