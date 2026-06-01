export const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How long does implementation typically take?',
    answer: 'Implementation time varies by organization size and complexity. For mid-sized manufacturers, a typical rollout takes 4-6 weeks. Enterprise deployments across multiple facilities usually require 3-6 months. We provide a dedicated implementation manager for all plans.',
    category: 'Implementation'
  },
  {
    id: '2',
    question: 'Can TrillionIndustries integrate with our existing ERP?',
    answer: 'Yes, we offer seamless integrations with all major ERP systems including SAP, Oracle, Microsoft Dynamics, and Epicor. Our REST API also allows for custom integrations with legacy or proprietary systems.',
    category: 'Integration'
  },
  {
    id: '3',
    question: 'Is my manufacturing data secure?',
    answer: 'Security is our top priority. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is SOC 2 Type II certified, and we maintain strict access controls, continuous monitoring, and regular third-party penetration testing.',
    category: 'Security'
  },
  {
    id: '4',
    question: 'Do you offer on-premise deployment options?',
    answer: 'While TrillionIndustries is primarily a cloud-native SaaS platform, we do offer private cloud and on-premise deployment options for Enterprise customers with strict compliance or security requirements. Contact our sales team for details.',
    category: 'Technical'
  },
  {
    id: '5',
    question: 'What level of support is included?',
    answer: 'All plans include 24/5 email support. The Professional plan adds priority response and live chat. Enterprise customers receive 24/7 dedicated phone support, a dedicated Customer Success Manager, and a custom Service Level Agreement (SLA).',
    category: 'Support'
  },
  {
    id: '6',
    question: 'Can we switch billing plans later?',
    answer: 'Absolutely. You can upgrade your plan at any time, and the prorated difference will be applied to your next billing cycle. Downgrades take effect at the end of your current billing period.',
    category: 'Pricing'
  },
  {
    id: '7',
    question: 'Does the platform support IoT sensor data?',
    answer: 'Yes, our Advanced Manufacturing module connects directly with most industrial IoT sensors, PLCs, and SCADA systems using protocols like MQTT, OPC-UA, and Modbus to provide real-time equipment monitoring and predictive maintenance.',
    category: 'Features'
  }
];

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Essential tools for small manufacturing teams to digitize operations.',
    monthlyPrice: 299,
    annualPrice: 249,
    highlighted: false,
    features: [
      'Up to 10 users',
      'Basic inventory management',
      'Production scheduling',
      'Standard reporting',
      'Email support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Advanced capabilities for growing manufacturers optimizing processes.',
    monthlyPrice: 799,
    annualPrice: 659,
    highlighted: true,
    badge: 'Most Popular',
    features: [
      'Up to 50 users',
      'Advanced IoT integrations',
      'Predictive maintenance',
      'Quality control workflows',
      'Custom dashboards',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Comprehensive platform for large-scale, multi-facility organizations.',
    monthlyPrice: 2499,
    annualPrice: 1999,
    highlighted: false,
    features: [
      'Unlimited users',
      'Multi-facility management',
      'ERP integrations (SAP, Oracle)',
      'Custom API access',
      'On-premise deployment option',
      'Dedicated Customer Success Manager',
      '24/7 phone support & SLA'
    ]
  }
];

export const NAV_ITEMS = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Resources',
    href: '#',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
    ]
  },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const TESTIMONIALS = [
  {
    id: '1',
    rating: 5,
    content: "TrillionIndustries completely modernized our shop floor. The IoT integration gave us real-time visibility that we never had before, reducing our machine downtime by 35% in the first quarter alone. Highly recommended.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    name: 'David Chen',
    role: 'VP of Manufacturing',
    company: 'Apex Auto'
  },
  {
    id: '2',
    rating: 5,
    content: "The unified procurement and supplier management modules streamlined our supply chain drastically. We cut our raw material procurement cycle time from 14 days to just 3 days.",
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&q=80',
    name: 'Sarah Jenkins',
    role: 'Supply Chain Director',
    company: 'Nordic Metals'
  },
  {
    id: '3',
    rating: 5,
    content: "Implementation was surprisingly fast for an enterprise ERP replacement. The user interface is incredibly intuitive, meaning our floor workers adopted it immediately without extensive training.",
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80',
    name: 'Michael Rodriguez',
    role: 'Operations Manager',
    company: 'Sunrise Chemicals'
  },
  {
    id: '4',
    rating: 4,
    content: "Their predictive maintenance algorithms have saved us hundreds of thousands of dollars in prevented catastrophic machine failures. It's an indispensable tool for our daily operations.",
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80',
    name: 'Elena Rostova',
    role: 'Lead Maintenance Engineer',
    company: 'Atlas Engineering'
  }
];

export const FEATURES_LIST = [
  {
    id: 'feature-1',
    title: 'Production Management',
    description: 'Optimize manufacturing lines, track WIP, and monitor OEE in real-time.',
    icon: 'Factory',
    category: 'Core'
  },
  {
    id: 'feature-2',
    title: 'Supply Chain & Procurement',
    description: 'Streamline sourcing, automate POs, and manage supplier performance.',
    icon: 'Network',
    category: 'Operations'
  },
  {
    id: 'feature-3',
    title: 'Predictive Maintenance',
    description: 'Use IIoT data to predict machine failures before they impact production.',
    icon: 'Wrench',
    category: 'Operations'
  },
  {
    id: 'feature-4',
    title: 'Quality Control',
    description: 'Automate inspections and manage CAPAs with rigorous traceability.',
    icon: 'ShieldCheck',
    category: 'Core'
  },
  {
    id: 'feature-5',
    title: 'Enterprise Analytics',
    description: 'AI-driven insights to uncover inefficiencies and forecast demand.',
    icon: 'BarChart3',
    category: 'Intelligence'
  },
  {
    id: 'feature-6',
    title: 'Workforce Management',
    description: 'Track labor costs, certifications, and shop floor safety compliance.',
    icon: 'Users',
    category: 'Core'
  }
];

export const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Future of Predictive Maintenance in Heavy Industry',
    excerpt: 'How AI and machine learning are transforming how we maintain industrial equipment, saving millions in downtime.',
    category: 'Manufacturing',
    slug: 'future-predictive-maintenance',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&q=80',
    readTime: '6 min read',
    author: 'Elena Rostova',
    date: 'Oct 12, 2026'
  },
  {
    id: '2',
    title: 'Building a Resilient Supply Chain post-2025',
    excerpt: 'Key strategies for diversifying suppliers and mitigating global logistical risks using digital twins.',
    category: 'Supply Chain',
    slug: 'resilient-supply-chain-2025',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop&q=80',
    readTime: '8 min read',
    author: 'Sarah Jenkins',
    date: 'Sep 28, 2026'
  },
  {
    id: '3',
    title: 'IIoT Implementation: A Phased Approach',
    excerpt: 'Don\'t rip and replace. Learn how to retrofit legacy PLCs and bring your older equipment online securely.',
    category: 'IIoT',
    slug: 'iiot-phased-approach',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop&q=80',
    readTime: '5 min read',
    author: 'Marcus Vance',
    date: 'Sep 15, 2026'
  }
];
