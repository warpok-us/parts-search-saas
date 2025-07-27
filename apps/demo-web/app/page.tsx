'use client';

import React from 'react';
import Link from 'next/link';

// Demo data and interfaces (matching what we have in the demo page)
interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DemoFeature {
  title: string;
  description: string;
  href: string;
  icon: string;
}

const demoFeatures: DemoFeature[] = [
  {
    title: 'Parts Search Demo',
    description: 'Interactive search with filters, real-time results, and component showcase',
    href: '/demo',
    icon: '🔍'
  },
  {
    title: 'Domain-Driven Design',
    description: 'Explore how our application layer, domain, and infrastructure work together',
    href: '/demo',
    icon: '🏗️'
  },
  {
    title: 'Component Library',
    description: 'Reusable UI components built with TypeScript and modern React patterns',
    href: '/demo',
    icon: '🧩'
  },
  {
    title: 'Type Safety',
    description: 'End-to-end TypeScript with strict typing for DTOs, entities, and components',
    href: '/demo',
    icon: '🛡️'
  }
];

// Mock data preview (subset of what's available in demo)
const mockPartsPreview: PartDTO[] = [
  {
    id: '1',
    partNumber: 'ENG-001',
    name: 'V8 Engine Block',
    description: 'High-performance V8 engine block for sports cars',
    price: 2500.00,
    quantity: 5,
    status: 'ACTIVE',
    category: 'Engine',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    partNumber: 'BRK-002',
    name: 'Brake Disc Set',
    description: 'Premium brake disc set for front wheels',
    price: 150.00,
    quantity: 20,
    status: 'ACTIVE',
    category: 'Brakes',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    partNumber: 'TIR-003',
    name: 'All-Season Tire',
    description: 'Durable all-season tire 225/60R16',
    price: 89.99,
    quantity: 100,
    status: 'ACTIVE',
    category: 'Tires',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Parts Search SaaS
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Domain-Driven Design Demo Platform
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
            Explore our modern e-commerce parts search system built with Next.js, TypeScript, 
            and clean architecture principles. Featuring real-time search, component reusability, 
            and type-safe data flow.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/demo"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Try Interactive Demo
            </Link>
            <a 
              href="#features"
              className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg border border-gray-200"
            >
              Learn More
            </a>
          </div>
        </section>
        {/* Quick Demo Access */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🚀 Try the Interactive Demo
              </h2>
              <p className="text-gray-600 mb-6">
                Experience our parts search system with live data and interactive components
              </p>
              <Link 
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="mr-2">🔍</span>
                Launch Parts Search Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoFeatures.map((feature, index) => (
              <Link 
                key={index}
                href={feature.href}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-blue-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Sample Data Preview */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Sample Parts Data
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Here&apos;s a preview of the test data available in our demo. 
              Click &quot;Launch Demo&quot; to interact with the full dataset and search functionality.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {mockPartsPreview.map((part) => (
                <div key={part.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{part.name}</h4>
                    <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {part.partNumber}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{part.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Price:</span>
                      <span className="font-bold text-green-600">${part.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className={part.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                        {part.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {part.category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {part.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link 
                href="/demo"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                View All Parts & Search Features →
              </Link>
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Technical Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Presentation Layer</h3>
                <p className="text-gray-600">
                  Next.js 15 with React 19, TypeScript, and Tailwind CSS for modern, responsive UI components
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Application Layer</h3>
                <p className="text-gray-600">
                  Use cases, DTOs, and service orchestration following clean architecture principles
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗄️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Domain & Infrastructure</h3>
                <p className="text-gray-600">
                  Rich domain models, repositories, and infrastructure adapters with dependency inversion
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
            <p className="text-gray-300 mb-6">
              Dive into the interactive demo to see how all components work together
            </p>
            <Link 
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Start Interactive Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
