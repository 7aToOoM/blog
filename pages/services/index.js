import Layout from '../../components/Layout';
import ServiceCard from '../../components/ServiceCard';
import { getServices } from '../../lib/dataStore';

export default function ServicesPage({ services }) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Our Services</h1>
          <p className="text-stone-500 mt-2">Professional design, delivery, and restoration services</p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  return { props: { services: getServices() } };
}
