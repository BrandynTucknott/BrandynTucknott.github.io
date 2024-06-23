# scratch code for project euler problem 66
# find minimal x such that x^2 - Dy^2 = 1


from primePy import primes
import numpy as np
import math

# generate solutions, but for given x not D
# for x in range(2, MAX_RANGE):
#     factors = primes.factors(x*x - 1)

#     i = 0
#     y = 1
#     while (i < len(factors)):
#         popped = False
#         if i < len(factors) - 1 and factors[i] == factors[i + 1]: # if there are two divisors that are the same
#             y *= factors[i] # remove both and put them into y^2
#             factors.pop(i) 
#             factors.pop(i)
#             popped = True

#         if (not popped):
#             i += 1
    
#     D = np.prod(factors)
#     print("x:", x, "\ty:", y, "\tD:", D)



# primes = primes.between(2, 1000)
# for p in primes:
#     y = 1
#     while True:
#         print(y)
#         x = math.sqrt(y**2 * p)
#         if (x == int(x)):
#             print("p:", p, "\tx:", x)
#             break
#         y += 1


# pregenerate list of squares
# squares = []
# for i in range(2, 1000):
#     squares.append(i**2)


# def getIndex(n):
#     for i in range(0, len(squares)):
#         if squares[i] >= n:
#             return i

# largest = 0
# for x2 in squares:
#     y2_lower = math.floor(math.sqrt(math.floor((x2 - 1) / 1000)))
#     y2_upper = math.ceil(math.sqrt(math.ceil(x2 - 1))) + 1
#     if y2_lower == 0:
#         y2_lower += 1
#     if y2_lower > y2_upper:
#         continue
#     lower_index = getIndex(y2_lower)
#     upper_index = getIndex(y2_upper)
#     for i in range(lower_index, upper_index):
#         y2 = squares[i]
#         if (x2 - 1) % y2 == 0:
#             D = (x2 - 1) / y2
#             if (D > largest and D <= 1000):
#                 largest = D

# print("D:", largest)

