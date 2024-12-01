<?php

use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return function (RoutingConfigurator $routes) {
    $routes->add('signin', '/api/login')
        ->methods(['POST']);

    $routes->add('authStatus', '/api/auth-status')
        ->controller([App\Controller\AuthController::class, 'authStatus'])
        ->methods(['GET']);

    $routes->add('usersAdd', '/api/users/add')
        ->controller([App\Controller\AdminUsersActionController::class, 'addUser'])
        ->methods(['POST']);

    $routes->add('erasmusCreate', '/api/erasmus-in/add')
        ->controller([App\Controller\GeneralProtectedController::class, 'addErasmusIn'])
        ->methods(['POST']);

    $routes->add('erasmusUpdate', '/api/erasmus-in/update')
        ->controller([App\Controller\GeneralProtectedController::class, 'updateErasmus'])
        ->methods(['PUT']);

    $routes->add('erasmusDelete', '/api/erasmus-in/delete')
        ->controller([App\Controller\GeneralProtectedController::class, 'deleteErasmus'])
        ->methods(['DELETE']);

    $routes->add('erasmusInList', '/api/erasmus-in/list')
        ->controller([App\Controller\GeneralProtectedController::class, 'listErasmusIn'])
        ->methods(['GET']);

    $routes->add('logout', '/api/logout')
        ->controller([App\Controller\AuthController::class, 'logout'])
        ->methods(['GET']);
};