<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends AbstractController
{

    /**
     * Endpoint sprawdzający status uwierzytelnienia użytkownika.
     *
     * @param Security $security
     *
     * @return JsonResponse 
     */
    public function authStatus(Security $security): JsonResponse
    {
        $user = $security->getUser();

        if ($user) {
            return new JsonResponse([
                'isAuthenticated' => true,
                'username' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
            ]);
        } else {
            return new JsonResponse(['isAuthenticated' => false]);
        }
    }

    /**
     * Endpoint obsługujący wylogowanie użytkownika.
     *
     * @return JsonResponse 
     */
    public function logout(): JsonResponse
    {
        $response = new JsonResponse(['message' => 'Zostałeś wylogowany.'], Response::HTTP_OK);

        $response->headers->clearCookie('BEARER');

        return $response;
    }
}