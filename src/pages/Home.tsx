import { motion } from 'framer-motion'
import Hero from '../sections/Hero'
import FeaturedProducts from '../sections/FeaturedProducts'
import Editorial from '../sections/Editorial'
import Categories from '../sections/Categories'
import Manifesto from '../sections/Manifesto'
import Newsletter from '../sections/Newsletter'

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <FeaturedProducts />
      <Editorial />
      <Categories />
      <Manifesto />
      <Newsletter />
    </motion.div>
  )
}
