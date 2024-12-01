<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;
    private $router;
    private $params;

    public function __construct(JWTTokenManagerInterface $jwtManager, RouterInterface $router, ParameterBagInterface $params)
    {
        $this->jwtManager = $jwtManager;
        $this->router = $router;
        $this->params = $params;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): JsonResponse
    {
        $jwt = $this->jwtManager->create($token->getUser());

        $tokenTtl = $this->params->get('jwt_token_ttl');

        $user = $token->getUser();

        $username = $user->getUserIdentifier();
        $roles = $user->getRoles();

        $data = [
            'message' => 'Zalogowano pomyślnie.',
            'username' => $username,
            'roles' => $roles,
        ];

        $response = new JsonResponse($data);

        $response->headers->setCookie(
            new Cookie(
                'BEARER',
                $jwt,
                time() + $tokenTtl,
                '/',
                null,
                true,
                true,
                false,
                'Strict'
            )
        );

        return $response;
    }
}