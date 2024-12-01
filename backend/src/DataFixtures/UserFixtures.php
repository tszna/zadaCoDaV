<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $admin = new User();
        $admin->setUsername('admin');
        $admin->setEmail('admin@proton.me');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword(
            $this->passwordHasher->hashPassword(
                $admin,
                'admin123'
            )
        );
        $manager->persist($admin);
        $this->addReference('user-admin', $admin);

        $studentTeacher = new User();
        $studentTeacher->setUsername('student_teacher');
        $studentTeacher->setEmail('student.teacher@proton.me');
        $studentTeacher->setRoles(['ROLE_STUDENT', 'ROLE_TEACHER']);
        $studentTeacher->setPassword(
            $this->passwordHasher->hashPassword(
                $studentTeacher,
                'studentteacher123'
            )
        );
        $manager->persist($studentTeacher);
        $this->addReference('user-student_teacher', $studentTeacher);

        $student = new User();
        $student->setUsername('student');
        $student->setEmail('student@proton.me');
        $student->setRoles(['ROLE_STUDENT']);
        $student->setPassword(
            $this->passwordHasher->hashPassword(
                $student,
                'student123'
            )
        );
        $manager->persist($student);
        $this->addReference('user-student', $student);

        $manager->flush();
    }
}