<?php

namespace App\DataFixtures;

use App\Entity\ErasmusIn;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class ErasmusInFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        /** @var User $student */
        $student = $this->getReference('user-student');

        /** @var User $studentTeacher */
        $studentTeacher = $this->getReference('user-student_teacher');

        $erasmus1 = new ErasmusIn();
        $erasmus1->setStudent($student);
        $erasmus1->setDepartureDate(new \DateTime('2024-01-15'));
        $erasmus1->setDestinationName('University of Cambridge');
        $manager->persist($erasmus1);

        $erasmus = new ErasmusIn();
        $erasmus->setStudent($studentTeacher);
        $erasmus->setDepartureDate(new \DateTime('2024-02-20'));
        $erasmus->setDestinationName('University of Oxford');
        $manager->persist($erasmus);

        $erasmus = new ErasmusIn();
        $erasmus->setStudent($student);
        $erasmus->setDepartureDate(new \DateTime('2024-03-10'));
        $erasmus->setDestinationName('University of Barcelona');
        $manager->persist($erasmus);

        $manager->flush();
    }

    public function getDependencies()
    {
        return [
            UserFixtures::class,
        ];
    }
}
