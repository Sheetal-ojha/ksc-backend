import { DataSource } from 'typeorm';
import { Department } from '../department/department.entity';
import { Class } from '../department/class.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',       // your pgAdmin username
  password: 'yourpassword',   // your pgAdmin password
  database: 'yourdbname',     // your database name
  entities: [Department, Class],
  synchronize: true,
});

// Define all departments and their classes
const seedData = [
  {
    name: 'Education',
    classes: ['11', '12'],
  },
  {
    name: 'Management',
    classes: ['11', '12', '1sem', '2sem', '3sem', '4sem', '5sem', '6sem', '7sem', '8sem'],
  },
  {
    name: 'Humanities',
    classes: ['11', '12'],
  },
  {
    name: 'Science',
    classes: ['11', '12', '1sem', '2sem', '3sem', '4sem', '5sem', '6sem', '7sem', '8sem'],
  },
  {
    name: 'Engineering',
    classes: [
      '1sem', '2sem', '3sem', '4sem',
      '5sem', '6sem', '7sem', '8sem',
      '1year', '2year', '3year', '4year',
    ],
  },
  {
    name: 'Law',
    classes: ['1year', '2year', '3year', '4year'],
  },
  {
    name: 'Medicine',
    classes: ['1year', '2year', '3year', '4year'],
  },
];

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const departmentRepo = AppDataSource.getRepository(Department);
  const classRepo = AppDataSource.getRepository(Class);

  for (const data of seedData) {
    // Check if department already exists
    let dept = await departmentRepo.findOne({ where: { name: data.name } });

    if (!dept) {
      dept = departmentRepo.create({ name: data.name });
      dept = await departmentRepo.save(dept);
      console.log(`✅ Created department: ${dept.name} (id: ${dept.id})`);
    } else {
      console.log(`⏭️  Department already exists: ${dept.name}`);
    }

    // Create classes for this department
    for (const className of data.classes) {
      const existingClass = await classRepo.findOne({
        where: { name: className, department: { id: dept.id } },
      });

      if (!existingClass) {
        const newClass = classRepo.create({ name: className, department: dept });
        await classRepo.save(newClass);
        console.log(`   ➕ Created class: ${className} under ${dept.name}`);
      } else {
        console.log(`   ⏭️  Class already exists: ${className} under ${dept.name}`);
      }
    }
  }

  console.log('\n🎉 Seeding complete!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});