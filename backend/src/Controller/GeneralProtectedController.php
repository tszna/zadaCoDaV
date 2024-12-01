<?php

namespace App\Controller;

use App\Entity\ErasmusIn;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class GeneralProtectedController extends AbstractController
{
    /**
     * Endpoint do wyświetlania listy erasmus
     * 
     * @param EntityManagerInterface $entityManager
     * 
     * @return JsonResponse Zwraca odpowiedź JSON:
     * - HTTP 200 (OK)
     * - HTTP 401 (Unauthorized)
     */
    public function listErasmusIn(EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $erasmusInEntries = $entityManager->getRepository(ErasmusIn::class)->findBy([
            'student' => $user,
        ]);

        $data = [];
        foreach ($erasmusInEntries as $entry) {
            $data[] = [
                'id' => $entry->getId(),
                'departure_date' => $entry->getDepartureDate()->format('Y-m-d'),
                'destination_name' => $entry->getDestinationName(),
                'created_at' => $entry->getCreatedAt()->format('Y-m-d H:i:s'),
                'updated_at' => $entry->getUpdatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    /**
     * Endpoint do tworzenia nowego wpisu w tabeli od erasmusa
     * 
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * 
     * @return JsonResponse Zwraca odpowiedź JSON:
     * - HTTP 201 (Created)
     * - HTTP 415 (Unsupported Media Type)
     * - HTTP 400 (Bad Request)
     * - HTTP 401 (Unauthorized)
     */
    public function addErasmusIn(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$request->headers->contains('Content-Type', 'application/json')) {
            return new JsonResponse(['error' => 'Content type must be application/json'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }

        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['departure_date']) || !isset($data['destination_name'])) {
            return new JsonResponse(['error' => 'Missing required fields: departure_date and destination_name'], Response::HTTP_BAD_REQUEST);
        }

        $erasmusIn = new ErasmusIn();

        $departureDate = \DateTime::createFromFormat('Y-m-d', $data['departure_date']);
        $dateErrors = \DateTime::getLastErrors();

        if ($departureDate === false) {
            return new JsonResponse(['error' => 'Invalid departure_date format. Expected format: YYYY-MM-DD'], Response::HTTP_BAD_REQUEST);
        }

        if ($dateErrors !== false && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0)) {
            return new JsonResponse(['error' => 'Invalid departure_date format. Expected format: YYYY-MM-DD'], Response::HTTP_BAD_REQUEST);
        }

        $erasmusIn->setDepartureDate($departureDate);

        $erasmusIn->setDestinationName($data['destination_name']);

        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $erasmusIn->setStudent($user);

        $entityManager->persist($erasmusIn);
        $entityManager->flush();

        return new JsonResponse(['message' => 'ErasmusIn entry created successfully'], Response::HTTP_CREATED);
    }

    /**
     * Endpoint do aktualizacji danych w tabeli od erasmusa
     * 
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * 
     * @return JsonResponse Zwraca odpowiedź JSON:
     * - HTTP 200 (OK) 
     * - HTTP 415 (Unsupported Media Type)
     * - HTTP 400 (Bad Request)
     * - HTTP 401 (Unauthorized)
     * - HTTP 404 (Not Found)
     */
    public function updateErasmus(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$request->headers->contains('Content-Type', 'application/json')) {
            return new JsonResponse(['error' => 'Content type must be application/json'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }

        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['id']) || !isset($data['departure_date'])) {
            return new JsonResponse(['error' => 'Missing required fields: id and departure_date'], Response::HTTP_BAD_REQUEST);
        }

        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $erasmusIn = $entityManager->getRepository(ErasmusIn::class)->findOneBy([
            'id' => $data['id'],
            'student' => $user,
        ]);

        if (!$erasmusIn) {
            return new JsonResponse(['error' => 'ErasmusIn entry not found or does not belong to the user'], Response::HTTP_NOT_FOUND);
        }

        $departureDate = \DateTime::createFromFormat('Y-m-d', $data['departure_date']);
        $dateErrors = \DateTime::getLastErrors();

        if ($departureDate === false) {
            return new JsonResponse(['error' => 'Invalid departure_date format. Expected format: YYYY-MM-DD'], Response::HTTP_BAD_REQUEST);
        }

        if ($dateErrors !== false && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0)) {
            return new JsonResponse(['error' => 'Invalid departure_date format. Expected format: YYYY-MM-DD'], Response::HTTP_BAD_REQUEST);
        }

        $erasmusIn->setDepartureDate($departureDate);

        $entityManager->flush();

        return new JsonResponse(['message' => 'Departure date updated successfully'], Response::HTTP_OK);
    }

    /**
     * Usuwanie danych o erasmus
     * 
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * 
     * @return JsonResponse Zwraca odpowiedź JSON:
     * - HTTP 200 (OK)
     * - HTTP 415 (Unsupported Media Type)
     * - HTTP 400 (Bad Request)
     * - HTTP 401 (Unauthorized)
     * - HTTP 404 (Not Found)
     */
    public function deleteErasmus(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$request->headers->contains('Content-Type', 'application/json')) {
            return new JsonResponse(['error' => 'Content type must be application/json'], Response::HTTP_UNSUPPORTED_MEDIA_TYPE);
        }

        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (!isset($data['id'])) {
            return new JsonResponse(['error' => 'Missing required field: id'], Response::HTTP_BAD_REQUEST);
        }

        /** @var User $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $erasmusIn = $entityManager->getRepository(ErasmusIn::class)->findOneBy([
            'id' => $data['id'],
            'student' => $user,
        ]);

        if (!$erasmusIn) {
            return new JsonResponse(['error' => 'ErasmusIn entry not found or does not belong to the user'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($erasmusIn);
        $entityManager->flush();

        return new JsonResponse(['message' => 'ErasmusIn entry deleted successfully'], Response::HTTP_OK);
    }
}