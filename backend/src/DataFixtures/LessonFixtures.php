<?php

namespace App\DataFixtures;

use App\Entity\Lesson;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class LessonFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
    /** @var User $admin */
    $admin = $this->getReference('user-admin');

    /** @var User $studentTeacher */
    $studentTeacher = $this->getReference('user-student_teacher');

    /** @var User $student */
    $student = $this->getReference('user-student');

    $lesson1 = new Lesson();
    $lesson1->setName('Lekcja Matematyki');
    $lesson1->setStudent($student);
    $lesson1->setTeacher($admin);
    $manager->persist($lesson1);

    $lesson2 = new Lesson();
    $lesson2->setName('Lekcja Fizyki');
    $lesson2->setStudent($studentTeacher);
    $lesson2->setTeacher($admin);
    $manager->persist($lesson2);

    $lesson3 = new Lesson();
    $lesson3->setName('Lekcja Chemii');
    $lesson3->setStudent($student);
    $lesson3->setTeacher($studentTeacher);
    $manager->persist($lesson3);

    $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
